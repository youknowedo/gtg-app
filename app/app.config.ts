import { ExpoConfig } from "@expo/config";
import { withEntitlementsPlist } from "@expo/config-plugins";

const withRemoveiOSNotificationEntitlement = (config: ExpoConfig) => {
    return withEntitlementsPlist(config, (mod) => {
        mod.modResults = { ...mod.modResults, "aps-environment": undefined };
        return mod;
    });
};

type Dict = { [key: string]: any };
export default ({ config }: Dict) => {
    return {
        ...config,
        plugins: [
            ...(config.plugins ?? []),
            [withRemoveiOSNotificationEntitlement],
        ],
    };
};
