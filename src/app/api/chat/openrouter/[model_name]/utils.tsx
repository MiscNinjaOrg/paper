interface Dictionary<T> {
    [Key: string]: T;
}

export const ModelNameMapping = {
    "capybara-7b": "nousresearch/nous-capybara-7b",
    "gpt-3.5-turbo": "openai/gpt-3.5-turbo",
    "gpt-4": "openai/gpt-4"
} as Dictionary<string>