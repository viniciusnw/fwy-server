export type Auth = {
  scope: string
  access_token: string
  token_type: string,
  app_id: string,
  expires_in: number,
  nonce: string
}

enum ListPlans_status {
  CREATED,
  INACTIVE,
  ACTIVE,
}

export type Plan = {
  id: string,
  name: string,
  
  // ListPlans_status
  status: string,
  description: string,
  usage_type: string,
  create_time: string,

  billing_cycles: Array<{
    pricing_scheme: {
      version: number,
      fixed_price: {
        currency_code: string,
        value: string
      },
      create_time: string,
      update_time: string
    },
    frequency: {
      interval_unit: string,
      interval_count: number
    },
    tenure_type: string,
    sequence: number,
    total_cycles: number
  }>,
  taxes: {
    percentage: string,
    inclusive: boolean
  },
  quantity_supported: boolean,
  update_time: string,
}

export type ListPlans = {
  plans: Array<Omit<Plan, 'billing_cycles' | 'taxes' | 'quantity_supported' | 'update_time'>>
}
