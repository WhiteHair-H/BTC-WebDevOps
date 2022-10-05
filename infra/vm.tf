#################################################
# WEB
resource "azurerm_public_ip" "Web_pub" {
  name = "Web_pub"
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  location = azurerm_resource_group.Three_Tier_rg.location
  allocation_method = "Static"
}

resource "azurerm_network_interface" "Web_ni" {
  name = "Web-nic"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name

  ip_configuration {
    name = "web_ip"
    subnet_id = azurerm_subnet.Web_subnet.id
    public_ip_address_id = azurerm_public_ip.Web_pub.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_virtual_machine" "Web_vm" {
  name = "Web_vm"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  network_interface_ids = [azurerm_network_interface.Web_ni.id]
  vm_size = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "OpenLogic"
    offer = "CentOS"
    sku = "7.5"
    version = "latest"
  }

  storage_os_disk {
    name = "Web_disk"
    caching = "ReadWrite"
    create_option = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  os_profile {
    computer_name = "web"
    admin_username = "dana"
    admin_password = "~1q2w3e4r5t6y"
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }
}


#################################################
# WAS
resource "azurerm_network_interface" "Was_ni" {
  name = "Was-nic"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name

  ip_configuration {
    name = "was_ip"
    subnet_id = azurerm_subnet.Was_subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_virtual_machine" "Was_vm" {
  name = "Was_vm"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  network_interface_ids = [azurerm_network_interface.Was_ni.id]
  vm_size = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "OpenLogic"
    offer = "CentOS"
    sku = "7.5"
    version = "latest"
  }

  storage_os_disk {
    name = "Was_disk"
    caching = "ReadWrite"
    create_option = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  os_profile {
    computer_name = "was"
    admin_username = "dana"
    admin_password = "~1q2w3e4r5t6y"
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }
}


# #################################################
# # DB
# resource "azurerm_network_interface" "DB_ni" {
#   name = "DB-nic"
#   location = azurerm_resource_group.Three_Tier_rg.location
#   resource_group_name = azurerm_resource_group.Three_Tier_rg.name

#   ip_configuration {
#     name = "DB_ip"
#     subnet_id = azurerm_subnet.DB_subnet.id
#     private_ip_address_allocation = "Dynamic"
#   }
# }

# resource "azurerm_virtual_machine" "DB_vm" {
#   name = "DB_vm"
#   location = azurerm_resource_group.Three_Tier_rg.location
#   resource_group_name = azurerm_resource_group.Three_Tier_rg.name
#   network_interface_ids = [azurerm_network_interface.DB_ni.id]
#   vm_size = "Standard_DS1_v2"

#   storage_image_reference {
#     publisher = "OpenLogic"
#     offer = "CentOS"
#     sku = "7.5"
#     version = "latest"
#   }

#   storage_os_disk {
#     name = "DB_disk"
#     caching = "ReadWrite"
#     create_option = "FromImage"
#     managed_disk_type = "Standard_LRS"
#   }

#   os_profile {
#     computer_name = "db"
#     admin_username = "dana"
#     admin_password = "~1q2w3e4r5t6y"
#   }

#   os_profile_linux_config {
#     disable_password_authentication = false
#   }
# }