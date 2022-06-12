# TODOS

These are things that need to be done (we should create stories, but maybe for next PI?).

1. Easy peasy:
   1. The JD app currently calls EP with `counterpartyId` in the URL. This should be changed (on both ends) to `counterpartyCode` to be consistent with the queries, etc.
   2. Speaking of which, the current EP query is `DduiByParty`, but it should be `DduiByCounterpartyCode`, again to avoid confusion.
2. The PhoneField is not set up properly with the state machines and the mutation for updating (it displays fine)
   1. The field is a composite field, so the countryCode and the lineNumber need to be combined into a single object.
   2. The Mutation needs to be updated so that composite field objects can be passed as variables. (See the mutation to see what it looks like.)
   3. There is no reason that the countryCode and lineNumber fields can't be handled independently by the form, but it needs to know to combine them, so maybe the individual fields have their common names (e.g., lineNumber), but also a `parentName` for the composite field (e.g., `mobileNumber`).
   4. When the form is submitted, the mutation can combined fields under common parent names in the `reducer`.
3. The AddressFinder field is another field that would be good to do as a composite, like the PhoneField, but it needs a toggle.
   1. The toggle is between automatically looking up the address with a LookupField (need to build this) and a manual form with one or more of the AddressFinder metadata fields (address components):
      1. BUILDING_NAME
      2. UNIT_TYPE
      3. UNIT_IDENTIFIER
      4. FLOOR
      5. NUMBER
      6. STREET
      7. STREET_TYPE
      8. STREET_NAME
      9. SUBURB
      10. CITY
      11. STATE
      12. BOX_TYPE
      13. BOX_NUMBER
      14. LOBBY_NAME
      15. RD_NUMBER
      16. POST_SUBURB
      17. MAIL_TOWN
      18. POSTCODE
      19. COUNTRY
   2. Weirdly, it aslo has a `longValue` and `shortValue`. Not sure how to handle these.
   3. Note: there is supposed to be an AddressFinder and Numverify back end proxy so we do these functions via company rather than directly. Benji was the person working on this, but he rolled off. Have heard nothing about it since.
4. The bank account numbers (and possibly other things like emails, addresses, or phone numbers) may eventually need the user to be able to ADD a new number, EDIT a number, or DELETE a number. None of this has been implemented yet. Should use the state machines and pub sub system like everything else.
5. I'd intended to add Storybook, so that's something that could be done in the `modules/getComponent/...` folders.
