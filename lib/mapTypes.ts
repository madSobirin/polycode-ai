// ─── SQL/JSON → Prisma Schema Types ────────────────────────────────────────
export function toPrismaType(sqlType: string): string {
  const t = sqlType.toUpperCase().split("(")[0].trim();
  const map: Record<string, string> = {
    // Integer types
    INT: "Int", INTEGER: "Int", TINYINT: "Int", SMALLINT: "Int",
    MEDIUMINT: "Int", BIGINT: "BigInt",
    // Float types
    FLOAT: "Float", DOUBLE: "Float", DECIMAL: "Decimal", NUMERIC: "Decimal",
    REAL: "Float",
    // String types
    VARCHAR: "String", CHAR: "String", TEXT: "String", TINYTEXT: "String",
    MEDIUMTEXT: "String", LONGTEXT: "String", NVARCHAR: "String",
    NCHAR: "String", CLOB: "String",
    // Boolean
    BOOLEAN: "Boolean", BOOL: "Boolean", BIT: "Boolean",
    // Date/Time
    DATE: "DateTime", DATETIME: "DateTime", TIMESTAMP: "DateTime",
    TIME: "String", YEAR: "Int",
    // Binary
    BLOB: "Bytes", BINARY: "Bytes", VARBINARY: "Bytes",
    BYTEA: "Bytes",
    // JSON
    JSON: "Json", JSONB: "Json",
    // UUID
    UUID: "String",
    // PostgreSQL specific
    SERIAL: "Int", BIGSERIAL: "BigInt",
  };
  return map[t] ?? "String";
}

// ─── SQL/JSON → Dart (Flutter) Types ───────────────────────────────────────
export function toDartType(sqlType: string, nullable: boolean): string {
  const t = sqlType.toUpperCase().split("(")[0].trim();
  const map: Record<string, string> = {
    INT: "int", INTEGER: "int", TINYINT: "int", SMALLINT: "int",
    MEDIUMINT: "int", BIGINT: "int",
    FLOAT: "double", DOUBLE: "double", DECIMAL: "double",
    NUMERIC: "double", REAL: "double",
    VARCHAR: "String", CHAR: "String", TEXT: "String", TINYTEXT: "String",
    MEDIUMTEXT: "String", LONGTEXT: "String", NVARCHAR: "String",
    CLOB: "String", UUID: "String",
    BOOLEAN: "bool", BOOL: "bool", BIT: "bool",
    DATE: "DateTime", DATETIME: "DateTime", TIMESTAMP: "DateTime",
    TIME: "String", YEAR: "int",
    BLOB: "Uint8List", BINARY: "Uint8List", VARBINARY: "Uint8List",
    JSON: "Map<String, dynamic>", JSONB: "Map<String, dynamic>",
    SERIAL: "int", BIGSERIAL: "int",
  };
  const base = map[t] ?? "String";
  return nullable ? `${base}?` : base;
}

// ─── SQL/JSON → TypeScript Types ────────────────────────────────────────────
export function toTypeScriptType(sqlType: string): string {
  const t = sqlType.toUpperCase().split("(")[0].trim();
  const map: Record<string, string> = {
    INT: "number", INTEGER: "number", TINYINT: "number", SMALLINT: "number",
    MEDIUMINT: "number", BIGINT: "bigint",
    FLOAT: "number", DOUBLE: "number", DECIMAL: "number",
    NUMERIC: "number", REAL: "number",
    VARCHAR: "string", CHAR: "string", TEXT: "string", TINYTEXT: "string",
    MEDIUMTEXT: "string", LONGTEXT: "string", NVARCHAR: "string",
    CLOB: "string", UUID: "string",
    BOOLEAN: "boolean", BOOL: "boolean", BIT: "boolean",
    DATE: "Date", DATETIME: "Date", TIMESTAMP: "Date",
    TIME: "string", YEAR: "number",
    BLOB: "Buffer", BINARY: "Buffer", VARBINARY: "Buffer",
    JSON: "Record<string, unknown>", JSONB: "Record<string, unknown>",
    SERIAL: "number", BIGSERIAL: "bigint",
  };
  return map[t] ?? "string";
}

// ─── Helper: Convert snake_case to PascalCase ─────────────────────────────
export function toPascalCase(str: string): string {
  return str
    .split(/[_\s-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

// ─── Helper: Convert snake_case to camelCase ──────────────────────────────
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
