output "master_public_ip" {
  value = azurerm_public_ip.master_pub.ip_address
  depends_on = [
    azurerm_virtual_machine.master_vm
  ]
}

output "node_public_ip" {
  value = azurerm_public_ip.node_pub.ip_address
  depends_on = [
    azurerm_virtual_machine.node_vm
  ]
}

output "node_2_public_ip" {
  value = azurerm_public_ip.node_2_pub.ip_address
  depends_on = [
    azurerm_virtual_machine.node_2_vm
  ]
}