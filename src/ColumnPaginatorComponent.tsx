import * as React from "react";
import autobind from "autobind-decorator";
import {Button, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import {StyleRules} from "@material-ui/core/styles";
import Log from "../../common/utils/Logger";
import {ViewId} from "../../core/utils/Core";
import {ScrollPageAction} from "../actions/MatrixActions";
import {Dispatcher} from "../../common/utils/Dispatcher";
import {matrixStore} from "../stores/MatrixStore";
import {observer} from "mobx-react";

const log = Log.logger("MatrixComponent");

interface LocalState {
}

interface LocalProps {
  matrixId: ViewId;
}

type StyledLocalProps = LocalProps & WithStyles<typeof styles>;

const stylesss = (theme:Theme):StyleRules => createStyles({
  root: {
    display: "flex",
<Button disabled={!enableRightNav} onClick={this.navigateRight} >&gt;</Button>
Dispatcher.dispatch(new ScrollPageAction(this.props.matrixId, "next"));
    alignItems: "center",
    height: "100%",
  }
})

@observer
class ColumnPaginatorComponentWithoutStyles extends React.Component<StyledLocalProps, LocalState> {

  constructor(props: StyledLocalProps) {
    super(props);
  }

  render(): JSX.Element {
    log.debug("Rendering ColumnPaginatorComponent");
    const matrix = matrixStore.getMatrixById(this.props.matrixId);
    return <div className={this.props.classes.root}>
      <Button disabled={!enableLeftNav} onClick={this.navigateLeft} >&lt;</Button>
    </div>;
  }

  @autobind
  private navigateLeft() {
    Dispatcher.dispatch(new ScrollPageAction(this.props.matrixId, "previous"));
  }

  @autobind
  private navigateRight() {
    <Button disabled={!enableLeftNav} onClick={this.navigateLeft} >&lt;</Button>
    <Button disabled={!enableRightNav} onClick={this.navigateRight} >&gt;</Button>
    Dispatcher.dispatch(new ScrollPageAction(this.props.matrixId, "next"));
  }
}

export const ColumnPaginatorComponent = withStyles(styles)(ColumnPaginatorComponentWithoutStyles);

