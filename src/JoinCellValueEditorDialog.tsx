import * as React from "react";
import {createStyles, Theme, WithStyles, withStyles} from "@material-ui/core";
import {ElementId, VisualTableId} from "../../core/utils/Core";
import autobind from "autobind-decorator";
import {StyleRules} from "@material-ui/core/styles";
import ListSelectionDialog from "../../common/components/ListSelectionDialog";
import {modelStore} from "../../core/stores/ModelStore";
import {NAME_ATT_NAME} from "../../api/api";
import {observer} from "mobx-react";
import {changeJoinCellConnections} from "../actions/MatrixAsyncActions";

const styles = (theme: Theme): StyleRules =>
    createStyles({});

export type ElementIdAndTitle = {
  id: ElementId;
  title: string;
};

interface LocalProps {
  open: boolean;
  /** element to connect to if list entry checked */
  rowElementId: ElementId;
  /** elements displayed in list */
  columnElementId: ElementId;
  /** join table to use */
  joinTableId: VisualTableId;
  /**
   * called if dialog is closed
   */
  onClose?: () => void;

}

type StyledLocalProps = LocalProps & WithStyles<typeof styles>;

@observer
export class JoinCellValueEditorDialog extends React.Component<StyledLocalProps, any> {
  constructor(props: StyledLocalProps) {
    super(props);
  }

  render(): JSX.Element {
    const tableId = this.props.joinTableId.tableId;
    const idsConnectedToColumn = modelStore.getConnectedElementIdsToTable(this.props.columnElementId, tableId);
    const titlesAndIdsConnectedToColumn = modelStore.getElementsById(idsConnectedToColumn).map(elementObject => ({
      id: elementObject.id,
      title: elementObject[NAME_ATT_NAME]
    }));
    const idsConnectedToRow = idsConnectedToColumn.filter(joinElementId => modelStore.isConnected(this.props.rowElementId, joinElementId));
    return <ListSelectionDialog
        open={this.props.open}
        title={modelStore.getTableName(tableId)}
        listObjects={titlesAndIdsConnectedToColumn}
        selectedObjectIds={idsConnectedToRow}
        onSubmit={this.onSubmit}
        onDiscard={this.onDiscard}
    />;
  }

  @autobind
  private onSubmit(titlesAndIdsConnectedToColumn: ElementIdAndTitle[], idsConnectedToRow: ElementId[]): void {
    changeJoinCellConnections(
        this.props.joinTableId.tableId,
      this.props.rowElementId,
      this.props.columnElementId,
      idsConnectedToRow,
      titlesAndIdsConnectedToColumn,
    );
    this.props.onClose && this.props.onClose();
  }

  @autobind
  private onDiscard(): void {
    this.props.onClose && this.props.onClose();
  }

}

export default withStyles(styles)(JoinCellValueEditorDialog);

