output "web_public" {
  value = azurerm_public_ip.Web_pub.ip_address
  depends_on = [
    azurerm_virtual_machine.Web_vm
  ]
}