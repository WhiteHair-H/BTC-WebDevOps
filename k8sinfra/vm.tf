#################################################
# Master
resource "azurerm_public_ip" "master_pub" {
  name = "master_pub"
  resource_group_name = azurerm_resource_group.k8s_rg.name
  location = azurerm_resource_group.k8s_rg.location
  allocation_method = "Static"
}

resource "azurerm_network_interface" "master_ni" {
  name = "master-nic"
  location = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name

  ip_configuration {
    name = "master_ip"
    subnet_id = azurerm_subnet.master_subnet.id
    public_ip_address_id = azurerm_public_ip.master_pub.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_virtual_machine" "master_vm" {
  name = "master"
  location = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name
  network_interface_ids = [azurerm_network_interface.master_ni.id]
  vm_size = "Standard_D4s_v3"

  storage_image_reference {
    publisher = "OpenLogic"
    offer = "CentOS"
    sku = "7.5"
    version = "latest"
  }

  storage_os_disk {
    name = "master_disk"
    caching = "ReadWrite"
    create_option = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  os_profile {
    computer_name = "master"
    admin_username = "dana"
    admin_password = "~1q2w3e4r5t6y"
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }
}

#################################################
# node
resource "azurerm_public_ip" "node_pub" {
  name = "node_pub"
  resource_group_name = azurerm_resource_group.k8s_rg.name
  location = azurerm_resource_group.k8s_rg.location
  allocation_method = "Static"
}

resource "azurerm_network_interface" "node_ni" {
  name = "node-nic"
  location = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name

  ip_configuration {
    name = "node_ip"
    subnet_id = azurerm_subnet.node_subnet.id
    public_ip_address_id = azurerm_public_ip.node_pub.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_virtual_machine" "node_vm" {
  name = "node"
  location = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name
  network_interface_ids = [azurerm_network_interface.node_ni.id]
  vm_size = "Standard_D2as_v4"

  storage_image_reference {
    publisher = "OpenLogic"
    offer = "CentOS"
    sku = "7.5"
    version = "latest"
  }

  storage_os_disk {
    name = "node_disk"
    caching = "ReadWrite"
    create_option = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  os_profile {
    computer_name = "node"
    admin_username = "dana"
    admin_password = "~1q2w3e4r5t6y"
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }
}