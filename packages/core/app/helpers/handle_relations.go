package helpers

import (
	"strings"
	"unicode"
)

func ConvertToStructNameList(namelist []string) []string {
	result := make([]string, len(namelist))

	for i, name := range namelist {
		result[i] = ConvertToStructName(name)
	}

	return result
}

func ConvertToStructName(s string) string {
	var result strings.Builder
	upperNext := true

	for _, char := range s {
		if char == '.' {
			upperNext = true
			result.WriteRune(char)

			continue
		}

		if char == '_' {
			upperNext = true

			continue
		}

		if upperNext {
			result.WriteRune(unicode.ToUpper(char))
			upperNext = false
		} else {
			result.WriteRune(char)
		}
	}

	return result.String()
}
