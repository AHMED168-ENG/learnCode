export default interface IUser {
  user_id?: number
  role_id?: number
  f_name?: any
  l_name?: any
  entity_name?: any
  sector_id_pk?: any
  gender?: any
  birth_date?: any
  region_id_pk?: any
  email?: any
  lang_prefer?: any
  user_img?: any
  account_status?: any
  deleted?: string
  deleted_date?: any
  sahlan_gained_points?: any
  carbon_gained_points?: any
  user_type?: string
  phone?: string
  user_pass?: string | null
  userSalt?: string | null
  phoneVerified?: boolean
  emailVerified?: boolean
  updatedAt?: string
  createdAt?: string
  google?: string
  facebook?: string
  apple?: string
}
