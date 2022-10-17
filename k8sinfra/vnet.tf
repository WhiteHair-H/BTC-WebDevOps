# vnet
resource "azurerm_virtual_network" "k8s_vnet" {
  name                = "k8s_vnet"
  resource_group_name = azurerm_resource_group.k8s_rg.name
  location            = azurerm_resource_group.k8s_rg.location
  address_space       = ["192.168.0.0/16"]
}

# master_subnet
resource "azurerm_subnet" "master_subnet" {
  name = "master_subnet"
  address_prefixes = ["192.168.10.0/24"]
  virtual_network_name = azurerm_virtual_network.k8s_vnet.name
  resource_group_name = azurerm_resource_group.k8s_rg.name
}

# node_subnet
resource "azurerm_subnet" "node_subnet" {
  name = "node_subnet"
  address_prefixes = ["192.168.20.0/24"]
  virtual_network_name = azurerm_virtual_network.k8s_vnet.name
  resource_group_name = azurerm_resource_group.k8s_rg.name
}

# master nsg
resource "azurerm_network_security_group" "master_sg" {
  name = "master_sg"
  location = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name

  security_rule {
    name = "master_ssh"
    priority = 1000
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "22"
    source_address_prefix = "20.194.109.211"
    destination_address_prefix = "*"
  }
}

# master nsga
resource "azurerm_subnet_network_security_group_association" "master_nsga" {
  subnet_id = azurerm_subnet.master_subnet.id
  network_security_group_id = azurerm_network_security_group.master_sg.id

  depends_on = [
    azurerm_network_security_group.master_sg
  ]
}

# node nsg
resource "azurerm_network_security_group" "node_sg" {
  name = "node_sg"
  location = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name

  security_rule {
    name = "node_ssh"
    priority = 1000
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "22"
    source_address_prefix = "20.194.109.211"
    destination_address_prefix = "*"
  }
}

# node nsga
resource "azurerm_subnet_network_security_group_association" "node_nsga" {
  subnet_id = azurerm_subnet.node_subnet.id
  network_security_group_id = azurerm_network_security_group.node_sg.id

  depends_on = [
    azurerm_network_security_group.node_sg
  ]
}