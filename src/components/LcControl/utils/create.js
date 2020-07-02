/**
 * Create a component with common options
 */
import create from 'vant/lib/utils/create'

import bem from '@/mixins/bem'

export default function(sfc) {
  sfc.clzname = 'lc-field'
  sfc.mixins = sfc.mixins || []
  sfc.mixins.push(bem)
  return create(sfc)
}
