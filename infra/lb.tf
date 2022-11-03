### ELB
resource "azurerm_public_ip" "dana-elb-pip" {
  name = "dana-elb-pip"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  allocation_method = "Static"
  sku = "Standard"
}

resource "azurerm_lb" "dana-elb" {
  name = "dana-elb"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  sku = "Standard"

  frontend_ip_configuration {
    name = "elb-frontip"
    public_ip_address_id = azurerm_public_ip.dana-elb-pip.id
  }

  depends_on = [
    azurerm_public_ip.dana-elb-pip
  ]
}

resource "azurerm_lb_rule" "dana-elb-rule" {
  loadbalancer_id = azurerm_lb.dana-elb.id
  name = "ELBRule"
  protocol = "Tcp"
  frontend_port = 80
  backend_port = 80
  probe_id = azurerm_lb_probe.elb-probe.id
  frontend_ip_configuration_name = "elb-frontip"
  backend_address_pool_ids = [azurerm_lb_backend_address_pool.elb-backend.id]

  depends_on = [
    azurerm_lb.dana-elb
  ]
}

resource "azurerm_lb_probe" "elb-probe" {
  loadbalancer_id = azurerm_lb.dana-elb.id
  name = "elb-probe"
  port = 80
}

resource "azurerm_lb_backend_address_pool" "elb-backend" {
  name = "elb-backend"
  loadbalancer_id = azurerm_lb.dana-elb.id
}

resource "azurerm_lb_backend_address_pool_address" "elb-backadd" {
  name = "elb-back-add"
  backend_address_pool_id = azurerm_lb_backend_address_pool.elb-backend.id
  virtual_network_id = azurerm_virtual_network.Three_Tier_vnet.id
  ip_address = azurerm_network_interface.Web_ni.private_ip_address

  depends_on = [
    azurerm_lb_backend_address_pool.elb-backend
  ]
}

### ILB
resource "azurerm_lb" "dana-ilb" {
  name = "dana-ilb"
  location = azurerm_resource_group.Three_Tier_rg.location
  resource_group_name = azurerm_resource_group.Three_Tier_rg.name
  sku = "Standard"

  frontend_ip_configuration {
    name = "ilb-frontip"
    subnet_id = azurerm_subnet.Was_subnet.id
    private_ip_address_allocation = "Dynamic"
  }

}

resource "azurerm_lb_rule" "dana-ilb-rule" {
  loadbalancer_id = azurerm_lb.dana-ilb.id
  name = "ILBRule"
  protocol = "Tcp"
  frontend_port = 80
  backend_port = 80
  probe_id = azurerm_lb_probe.ilb-probe.id
  frontend_ip_configuration_name = "ilb-frontip"
  backend_address_pool_ids = [azurerm_lb_backend_address_pool.ilb-backend.id]

  depends_on = [
    azurerm_lb_probe.ilb-probe
  ]
}

resource "azurerm_lb_probe" "ilb-probe" {
  loadbalancer_id = azurerm_lb.dana-ilb.id
  name = "ilb-probe"
  port = 8080
}

resource "azurerm_lb_backend_address_pool" "ilb-backend" {
  name = "ilb-backend"
  loadbalancer_id = azurerm_lb.dana-ilb.id
}

resource "azurerm_lb_backend_address_pool_address" "ilb-backadd" {
  name = "ilb-back-add"
  backend_address_pool_id = azurerm_lb_backend_address_pool.ilb-backend.id
  virtual_network_id = azurerm_virtual_network.Three_Tier_vnet.id
  ip_address = azurerm_network_interface.Was_ni.private_ip_address

  depends_on = [
    azurerm_lb_backend_address_pool.ilb-backend
  ]
}