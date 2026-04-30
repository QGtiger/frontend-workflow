import { builtInConnectors } from "../../../shared/connectors";
import { withCommonParams } from "../../../utils/withCommonParams";

export default withCommonParams(async () => {
  return builtInConnectors;
});
