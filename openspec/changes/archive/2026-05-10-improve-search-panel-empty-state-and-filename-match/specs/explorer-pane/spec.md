## MODIFIED Requirements

### Requirement: Explorer Pane renders a persistent Search panel
The system SHALL render Search as a dedicated Explorer Pane panel separate from the Active Changes, Archive, and Specs section group. When Search is active, the Explorer Pane SHALL show only the Search panel above the existing project selector footer. The panel SHALL follow the existing Explorer visual language while using a larger fixed header, search input, and persistent result list. Explanatory copy for initial, short-query, and no-results states SHALL render in the list/body area as placeholder content rather than as persistent descriptive prose in the header. The panel SHALL show result counts, loading state, short-query guidance, empty results, and a clear control as appropriate. Search result rows SHALL render as Explorer-style selectable list items using shared entity visual semantics, including distinct active-change and archived-change treatment when change results can be resolved to either state.

#### Scenario: Search panel initial state
- **WHEN** the Explorer Pane is switched to Search and no search query has been entered
- **THEN** the Search panel displays a prominent Search header
- **AND** it displays a search input
- **AND** the list area displays a localized placeholder explaining the search scope and minimum-query guidance

#### Scenario: Search panel no-results placeholder
- **WHEN** a valid search query returns no matches
- **THEN** the Search panel displays a no-results placeholder in the list area
- **AND** the placeholder includes localized explanatory text for the current query state
- **AND** the sticky header does not repeat that explanation as persistent prose

#### Scenario: Search panel result list
- **WHEN** a valid search query returns matches
- **THEN** the Search panel displays the number of matches
- **AND** it renders each result as a selectable Explorer-style list item with shared type semantics, name, and preview text
- **AND** archived change results are visually distinguishable from active change results

#### Scenario: Search header remains visible while results scroll
- **WHEN** the operator scrolls a long Search result list
- **THEN** the Search header, current query, status, and clear control remain visible at the top of the Search panel
- **AND** only the result list scrolls
