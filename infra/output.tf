output "web_public" {
  value = azurerm_public_ip.Web_pub.ip_address
  depends_on = [
    azurerm_virtual_machine.Web_vm
  ]
}

output "was_private" {
  value = azurerm_network_interface.Was_ni.private_ip_address
}