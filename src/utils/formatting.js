/**
 * Formats a word term for display.
 * Replaces underscores with spaces.
 * Example: "ad_hoc" -> "ad hoc"
 */
export function formatTerm(term) {
    if (!term) return "";
    return term.replace(/_/g, " ");
}
