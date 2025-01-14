/**
 * 前端配置管理工具的导出模块.
 * 
 * 提供统一的配置管理接口，支持环境变量、全局变量等多种配置源。
 *
 * @packageDocumentation
 * @author yusangeng@outlook.com
 */

import konph from "./konph";
import { KonphGlobal } from "./types";

/**
 * 配置管理器的全局配置接口
 */
export { KonphGlobal };

/**
 * 配置管理器的工厂函数
 * 
 * @param config - 配置定义对象
 * @returns 配置管理器实例
 */
export { konph };

/**
 * 默认导出配置管理器的工厂函数
 */
export default konph;
