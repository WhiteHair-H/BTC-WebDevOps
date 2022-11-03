# Create a resource group
resource "azurerm_resource_group" "Three_Tier_rg" {
  name     = "Three_Tier_rg"
  location = "japaneast"
}