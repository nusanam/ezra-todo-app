using System.ComponentModel.DataAnnotations;

namespace TodoApi.Application.Tasks.Validation;

public class NotWhitespaceAttribute : ValidationAttribute
{
    public NotWhitespaceAttribute() : base("{0} cannot be blank.")
    {
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not string stringValue)
            return ValidationResult.Success;

        if (string.IsNullOrWhiteSpace(stringValue))
            return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));

        return ValidationResult.Success;
    }
}