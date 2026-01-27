import { hero } from './hero'
import { homepage } from './homepage'
import { navigation } from './navigation'
import { committeeMember, committeePage } from './committee'
import { recruitmentPosition, recruitmentPage } from './recruitment'
import { sponsorPage } from './sponsor'
import { contactPage } from './contact'
import { oweekPage } from './oweek'
import { firstYearRecruitmentPage } from './firstYearRecruitment'

export const schemaTypes = [
  // Pages
  hero,
  homepage,
  committeePage,
  recruitmentPage,
  sponsorPage,
  contactPage,
  oweekPage,
  firstYearRecruitmentPage,
  navigation,
  // Individual items
  committeeMember,
  recruitmentPosition,
]
