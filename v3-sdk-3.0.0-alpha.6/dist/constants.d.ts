export declare const FACTORY_ADDRESS = "0xA1e393178DDFD63af56cf0BfA759A6a85606558c";
export declare const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export declare const POOL_INIT_CODE_HASH = "0xd63426cf28b23363557856eaa7e085559e81e6b7794066479952bda868617297";
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
