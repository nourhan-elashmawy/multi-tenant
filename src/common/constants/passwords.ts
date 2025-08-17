const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PASSWORD_RULE_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.';

export { PASSWORD_RULE, PASSWORD_RULE_MESSAGE };
