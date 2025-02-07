package responses

import "errors"

var (
	ErrUnhandledPgError      = errors.New("unknown error at our services")
	ErrUserAlreadyRegistered = errors.New("user already registered")
	ErrUserNotFound          = errors.New("user not found")

	ErrWorkspaceNotFound = errors.New("workspace not found")

	ErrFailedToCreateAgent = errors.New("failed to create agent")
	ErrAgentNotFound       = errors.New("agent not found")

	ErrFailedToScanJSONB    = errors.New("failed to scan jsonb as []byte")
	ErrFailedToReadJSONB    = errors.New("failed to read jsonb from []byte")
	ErrFailedToMarshalJSONB = errors.New("failed to marshal jsonb")
)
