// Accept everything (for user-friendly names) except for a comma, which is used
// to separate note names in the Apple Script for getting note names.
export default /^[^,]+$/;
