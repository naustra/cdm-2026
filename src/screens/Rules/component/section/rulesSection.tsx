import PropTypes from 'prop-types'
const RulesSection = (props) => (
  <div className="rules-section">{props.children}</div>
)

RulesSection.defaultProps = {
  children: null,
}

RulesSection.propTypes = {
  children: PropTypes.node,
}

export default RulesSection
