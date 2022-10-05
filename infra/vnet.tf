# vnet
resource "azurerm_virtual_network" "Three_Tier_vnet" {
  name                = "Three_Tier_vnet"
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  location            = azurerm_resource_group.Three_Tier_rg.location
  address_space       = ["192.168.0.0/16"]
}

# Web_subnet
resource "azurerm_subnet" "Web_subnet" {
  name = "Web_subnet"
  address_prefixes = ["192.168.10.0/24"]
  virtual_network_name = azurerm_virtual_network.Three_Tier_vnet.name
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
}

# Was_subnet
resource "azurerm_subnet" "Was_subnet" {
  name = "Was_subnet"
  address_prefixes = ["192.168.20.0/24"]
  virtual_network_name = azurerm_virtual_network.Three_Tier_vnet.name
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
}

# # DB_subnet
# resource "azurerm_subnet" "DB_subnet" {
#   name = "DB_subnet"
#   address_prefixes = ["192.168.30.0/24"]
#   virtual_network_name = azurerm_virtual_network.Three_Tier_vnet.name
#   resource_group_name = azurerm_resource_group.Three_Tier_rg.name
# }

resource "azurerm_network_security_group" "web_sg" {
  name = "web_sg"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name

  security_rule {
    name = "web_ssh"
    priority = 1000
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "22"
    source_address_prefix = "20.194.109.211"
    destination_address_prefix = "*"
  }

    security_rule {
    name = "web_http"
    priority = 1200
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "80"
    source_address_prefix = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "web_nsga" {
  subnet_id = azurerm_subnet.Web_subnet.id
  network_security_group_id = azurerm_network_security_group.web_sg.id

  depends_on = [
    azurerm_network_security_group.web_sg
  ]
}