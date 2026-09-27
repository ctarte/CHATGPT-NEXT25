export type StudioRole='reviewer'|'researcher'|'admin';
export const permissions={
reviewer:['case:read','assessment:read','signals:read','blueprint:edit','qa:write','approve:write'],
researcher:['case:read','brief:read','research:write'],
admin:['case:read','assessment:read','signals:read','blueprint:edit','qa:write','approve:write','release:write','user:manage']
} as const;
// Production must enforce server-side; UI hiding is never authorization.
