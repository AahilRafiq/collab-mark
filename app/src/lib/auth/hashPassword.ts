import bcrypt from 'bcrypt'

const saltRounds = 10

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
} 