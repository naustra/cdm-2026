import { type ComponentType } from 'react'
import isFunction from 'lodash/isFunction'

interface PlaceholderConfig {
  isLoaded: boolean | ((props: Record<string, unknown>) => boolean)
}

function Placeholder({ isLoaded }: PlaceholderConfig) {
  return function withPlaceholder<P extends Record<string, unknown>>(
    ComposedComponent: ComponentType<P>,
  ) {
    return function PlaceholderWrapper(props: P) {
      const ready = isFunction(isLoaded) ? isLoaded(props) : isLoaded

      if (!ready) {
        return <div className="animate-pulse bg-gray-200 rounded h-24 w-full" />
      }

      return <ComposedComponent {...props} />
    }
  }
}

export default Placeholder
