import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

if (process.env.NODE_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: "./.env.local", override: true });
}

const getSecretClient = () => {
  const keyVaultName = process.env.DEFRA_KEYVAULT_NAME;
  const kvUri = `https://${keyVaultName}.vault.azure.net`;
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(kvUri, credential);
  return client;
};

const getSecretValue = async (secretName) => {
  const client = getSecretClient();

  try {
    const secret = await client.getSecret(secretName);
    return secret.value;
  } catch (err) {
    console.error("KeyVault: Error retrieving secret:", err);
  }

  return null;
};

export default  { getSecretValue };