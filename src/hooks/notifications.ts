export function useNotificationPermission() {
  return { permission: 'old-navigator', refreshPermission: () => {} }
}

export function useNotificationConfiguration(): [null, () => void] {
  return [null, () => {}]
}

export function useRegisterNavigator(): [() => void] {
  return [() => {}]
}
