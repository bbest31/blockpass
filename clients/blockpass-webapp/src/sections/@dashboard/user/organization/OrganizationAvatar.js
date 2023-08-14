import PropTypes from 'prop-types';
// utils
import createAvatar from '../../../../utils/createAvatar';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

OrganizationAvatar.propTypes = {
  styles: PropTypes.object,
};

export default function OrganizationAvatar({ ...styles }) {
  const { organization } = useAuth();

  return (
    <Avatar
      src={organization?.branding?.logo_url}
      alt={organization?.display_name}
      color={organization?.branding?.logo_url ? 'default' : createAvatar(organization?.display_name).color}
      imgProps={{ sx: { objectFit: 'contain' } }}
      {...styles}
    >
      {createAvatar(organization?.display_name).name}
    </Avatar>
  );
}
