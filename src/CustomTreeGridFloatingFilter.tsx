/**
 * Created by P.Bernhard on 05.09.2017.
 */
import * as React from "react";
import * as _ from "lodash";
import EditableTextComponent from "../../common/components/EditableTextComponent";
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import Log from "../../common/utils/Logger";
import {Dispatcher} from "../../common/utils/Dispatcher";
import {StyleRules} from "@material-ui/core/styles";
import autobind from "autobind-decorator";
import {SaveQuickFilterTextAction} from "../actions/MatrixActions";

const log = Log.logger("CustomTreeGridFloatingFilter");


const styles = (theme: Theme): StyleRules => createStyles({
  rootValid: {
    height: "19px",
    border: "1px solid gray",
  },
  rootInvalid: {
    height: "19px",
    border: "1px solid #cd6155",
  }
});


interface TreeGridFloatingFilterParams {
  value: string;
  idParentTreeGrid: string;
  columnName: string;
  filterTextIsValid: (columnName: string) => boolean;
}

interface LocalState {
  value: string;
}

type StyledTreeGridFloatingFilterParams = TreeGridFloatingFilterParams & WithStyles<typeof styles>;

class CustomTreeGridFloatingFilter extends React.Component<StyledTreeGridFloatingFilterParams, LocalState> {

  constructor(props: StyledTreeGridFloatingFilterParams) {
    super(props);
    this.state = {
      value: this.props.value
    };
    // debounce filter event since it is expensive, MUST BE DONE HERE, DOES NOT WORK INLINE
    this.onFilterChangeDebounced = _.debounce(this.onFilterChangeDebounced, 500).bind(this);
  }


  private onFilterChangeDebounced(value: string): void {
    Dispatcher.dispatch(new SaveQuickFilterTextAction(this.props.idParentTreeGrid, this.props.columnName, value));
  }

  render(): JSX.Element {
    const style: string = this.props.filterTextIsValid(this.props.columnName) ? this.props.classes.rootValid : this.props.classes.rootInvalid;
    const tooltipText = `Condition column should match,case sensitive.<BR/>
Text is matched as prefix, *Text as contained.<BR/>
Examples: car, *car, !car, !*car, &lt;5, >7, =5, &lt;>7, >&lt;3;5.<BR/>
See help for more details.`;

    // vm20190708: tooltip registers mouseEnter and leave, but somehow this seems to get lost, so do it manually here
    const filterTextElement = <div data-testselector={"filter-" + this.props.columnName}
                                   data-tip={tooltipText}>{this.state.value}</div>;
    return <EditableTextComponent
        textElement={filterTextElement}
        classes={{textElement: style}}
        onUpdate={this.updateFilter}
        updateOnKeyPress={true}/>;
  }

  @autobind updateFilter(value: string): void {
    this.setState({value});
    this.onFilterChangeDebounced(value);
  }
}

export default withStyles(styles)(CustomTreeGridFloatingFilter);