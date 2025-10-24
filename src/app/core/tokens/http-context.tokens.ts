import { HttpContextToken } from '@angular/common/http';

export const BYPASS_REFRESH = new HttpContextToken(() => false);