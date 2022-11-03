output "web_public" {
  value = azurerm_public_ip.Web_pub.ip_address
  depends_on = [
    azurerm_virtual_machine.Web_vm
  ]
}

output "was_private" {
  value = azurerm_network_interface.Was_ni.private_ip_address
}

output "db_private" {
  value = azurerm_network_interface.DB_ni.private_ip_address
}

output "elb-pip" {
  value = azurerm_public_ip.dana-elb-pip.ip_address
}

output "elb-back-ip" {
  value = azurerm_network_interface.Web_ni.private_ip_address
}