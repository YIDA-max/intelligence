/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-28 18:06:46
 * @FilePath: \qianyi-ui\src\utils\mitt.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import mitt, { Emitter } from 'mitt';

const emitter: Emitter<MittType> = mitt<MittType>();

export default emitter;
