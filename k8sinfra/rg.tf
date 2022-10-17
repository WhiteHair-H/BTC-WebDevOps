# Create a resource group
resource "azurerm_resource_group" "k8s_rg" {
  name     = "k8s_rg"
  location = "japaneast"
}