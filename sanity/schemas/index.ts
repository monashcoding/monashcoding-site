import { hero } from './hero'
import { navigation } from './navigation'
import { teamMember, teamPage } from './team'
import { recruitmentPosition, recruitmentPage } from './recruitment'
import { sponsorPage } from './sponsor'
import { contactPage } from './contact'

export const schemaTypes = [
  // Pages
  hero,
  teamPage,
  recruitmentPage,
  sponsorPage,
  contactPage,
  navigation,
  // Individual items
  teamMember,
  recruitmentPosition,
]
