import { AppConfigurationClient } from "@azure/app-configuration";
import { DefaultAzureCredential } from "@azure/identity";

const ENABLE_CONFIGURATION_SERVER = process.env.ENABLE_CONFIGURATION_SERVER === "true";

let client;

if (ENABLE_CONFIGURATION_SERVER) {
  // Use Managed Identity (MI) authentication if ENABLE_CONFIGURATION_SERVER is true
  const credential = new DefaultAzureCredential();
  const configServer = process.env.AZURE_CONFIGURATION_SERVER;
  if (!configServer) {
    throw new Error("AZURE_CONFIGURATION_SERVER is not set but required when ENABLE_CONFIGURATION_SERVER is true.");
  }
  client = new AppConfigurationClient(configServer, credential);
} else {
  // Use connection string for local user (fallback mode)
  const connectionString = process.env.AZURE_CONFIGURATION_SERVER_ENDPOINT || "Endpoint=(.*);Id=(.*);Secret=(.*)";
  client = new AppConfigurationClient(connectionString);
}

const initializeFeatureFlags = async () => {
  const featureFlags = new Map();

  try {
    for await (const setting of client.listConfigurationSettings({ keyFilter: ".appconfig.featureflag/*" })) {
      const featureName = setting.key.replace(".appconfig.featureflag/", "");
      featureFlags.set(featureName, JSON.parse(setting.value));
    }

    return featureFlags;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error initializing feature flags:", error.message);
    throw error; 
  }
};

const isFeatureEnabled = async (featureName) => {
  try {
    const featureFlags = await initializeFeatureFlags();
    const featureFlag = featureFlags.get(featureName);

    // Check if the feature flag exists and if it's enabled (assuming the value is 'true' or 'enabled')
    return featureFlag && featureFlag.enabled === true;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error checking feature flag:", error.message);
    return false;
  }
};

export default {
  isFeatureEnabled,
};
