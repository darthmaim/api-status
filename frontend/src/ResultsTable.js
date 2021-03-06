import {h, Component} from 'preact'
import ResultsRow from './ResultsRow'

class ResultsTable extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      expanded: false
    }
  }

  render () {
    const results = this.props.results
    const {expanded} = this.state

    return (
      <div>
        <div className='text-center text-muted mb-4'>Last checked {results.updated_at.toLocaleString()}</div>

        <div>
          <table className='table result-table'>
            <thead className='thead-default'>
              <tr>
                <th>Endpoint</th>
                <th>Online</th>
                <th>Schema</th>
                <th>Content</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {results.data.filter(x => x.severity > 0).map(x => <ResultsRow data={x} />)}
              {this.renderSummaryRow(results)}
              {expanded && results.data.filter(x => x.severity === 0).map(x => <ResultsRow data={x} />)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderSummaryRow (results) {
    const workingResults = results.data.filter(x => x.severity === 0)
    const workingCount = workingResults.length

    if (workingCount === 0) {
      return null
    }

    const prefix = this.state.expanded ? '▼' : '▶'
    const count = workingCount === results.data.length ? 'All' : workingCount
    const text = `${prefix} ${count} endpoints fully operational 🎉`

    const averageDuration = Math.round(average(workingResults.map(x => x.duration)))

    const data = {
      name: text,
      status: 200,
      schemaValid: true,
      snapshotValid: true,
      duration: averageDuration
    }

    return (
      <ResultsRow
        data={data}
        onClick={() => this.setState({expanded: !this.state.expanded})}
        className='result-row--summary'
      />
    )
  }
}

function average (array) {
  const sum = array.reduce((sum, elem) => sum + elem, 0)
  return sum / array.length
}

export default ResultsTable
