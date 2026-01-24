import { hero } from './hero'
import { homepage } from './homepage'
import { navigation } from './navigation'
import { teamMember, teamPage } from './team'
import { recruitmentPosition, recruitmentPage } from './recruitment'
import { sponsorPage } from './sponsor'
import { contactPage } from './contact'
import { oweekPage } from './oweek'
import { firstYearRecruitmentPage } from './firstYearRecruitment'

export const schemaTypes = [
  // Pages
  hero,
  homepage,
  teamPage,
  recruitmentPage,
  sponsorPage,
  contactPage,
  oweekPage,
  firstYearRecruitmentPage,
  navigation,
  // Individual items
  teamMember,
  recruitmentPosition,
]
