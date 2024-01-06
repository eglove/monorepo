import { config } from 'dotenv';

import { imageOptimization } from './services/image-optimization/image-optimization';
import { userService } from './services/user-service/user-service';

config();

userService();
imageOptimization();
