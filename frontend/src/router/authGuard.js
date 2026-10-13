import { useRouter } from 'vue-router'

export function authGuard(to, from, next) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') // assumindo que o login salva o perfil

  if (!token) {
    return next('/login')
  }

  if (to.meta?.role && to.meta.role !== role) {
    return next('/login') // redireciona se perfil não tiver acesso
  }

  return next()
}
