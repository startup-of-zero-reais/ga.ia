package responses

import "errors"

var (
	// generic errors.

	ErrUnhandledPgError     = errors.New("unknown error at our services")
	ErrFailedToScanJSONB    = errors.New("failed to scan jsonb as []byte")
	ErrFailedToReadJSONB    = errors.New("failed to read jsonb from []byte")
	ErrFailedToMarshalJSONB = errors.New("failed to marshal jsonb")

	// users errors.

	ErrUserAlreadyRegistered = errors.New("user already registered")
	ErrUserNotFound          = errors.New("user not found")

	// workspace errors.

	ErrWorkspaceNotFound = errors.New("workspace not found")

	// agents errors.

	ErrFailedToCreateAgent = errors.New("failed to create agent")
	ErrAgentNotFound       = errors.New("agent not found")

	// plans errors.

	ErrFailedToFindPlans  = errors.New("can not find plans")
	ErrFailedToFindMyPlan = errors.New("can not find my plan")
)
