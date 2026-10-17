/**
 * User Model
 * Defines user entity structure and roles
 */

export const USER_ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

export class User {
  constructor({
    id,
    name,
    email,
    role = USER_ROLES.CUSTOMER,
    avatar = null,
    phone = '',
    address = '',
    createdAt = new Date().toISOString(),
    status = 'active',
    businessId = null,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.avatar = avatar;
    this.phone = phone;
    this.address = address;
    this.createdAt = createdAt;
    this.status = status; // 'active', 'suspended'
    this.businessId = businessId; // Linked business for provider role
  }

  isCustomer() {
    return this.role === USER_ROLES.CUSTOMER;
  }

  isProvider() {
    return this.role === USER_ROLES.PROVIDER;
  }

  isAdmin() {
    return this.role === USER_ROLES.ADMIN;
  }
}
