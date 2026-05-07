# dashboard-change-sorting Specification

## Purpose
Define sorting behavior for dashboard Active Changes and Recent Activity lists.

## Requirements
### Requirement: Dashboard Active Changes supports date and name sorting
The system SHALL allow operators to sort the dashboard Active Changes list by Date or Name. Date sorting SHALL be the default and SHALL order active changes by most recent modification first. Name sorting SHALL order active changes alphabetically by change name.

#### Scenario: Active Changes defaults to date sorting
- **WHEN** the dashboard renders the Active Changes list
- **THEN** the list is ordered by most recent modification first
- **AND** the sort control indicates Date sorting is active

#### Scenario: Operator sorts Active Changes by name
- **WHEN** the operator selects Name sorting for the dashboard Active Changes list
- **THEN** the list is reordered alphabetically by change name
- **AND** the sort control indicates Name sorting is active

### Requirement: Dashboard Recent Activity supports date and name sorting
The system SHALL allow operators to sort the dashboard Recent Activity list by Date or Name. Date sorting SHALL be the default and SHALL order activity items by most recent timestamp first. Name sorting SHALL order activity items alphabetically by their displayed item name.

#### Scenario: Recent Activity defaults to date sorting
- **WHEN** the dashboard renders the Recent Activity list
- **THEN** the list is ordered by most recent activity timestamp first
- **AND** the sort control indicates Date sorting is active

#### Scenario: Operator sorts Recent Activity by name
- **WHEN** the operator selects Name sorting for the dashboard Recent Activity list
- **THEN** the list is reordered alphabetically by displayed item name
- **AND** the sort control indicates Name sorting is active

### Requirement: Dashboard and explorer share sorting behavior
The system SHALL use a shared sorting base for dashboard and explorer date/name sorting so matching list item types use consistent date order, name order, and tie-breaker behavior.

#### Scenario: Shared date and name sorting is applied
- **WHEN** dashboard and explorer lists are sorted by Date or Name
- **THEN** shared sorting helpers define the ordering behavior
- **AND** explorer section defaults remain unchanged
