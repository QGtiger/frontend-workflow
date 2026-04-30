import { Connector } from "../connector";
import { webhookTrigger } from "./webhook";

export const builtInConnectors: Connector[] = [webhookTrigger];
