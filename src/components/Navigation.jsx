import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Badge,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryIcon,
  Add as AddIcon,
  Equalizer as StatsIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  ImportExport as ImportIcon,
  People as PeopleIcon,
  AccountCircle as UserIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  MoreVert as MoreIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon
} from '@mui/icons-material';
import './Navigation.css';

function Navigation({ isLoggedIn, username, onLogout, darkMode, onThemeToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [toolsMenuAnchor, setToolsMenuAnchor] = React.useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState(null);

  const users = [
    { id: 1, name: 'Анна', avatar: 'A' },
    { id: 2, name: 'Иван', avatar: 'И' },
    { id: 3, name: 'Мария', avatar: 'M' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleToolsMenuOpen = (event) => {
    setToolsMenuAnchor(event.currentTarget);
  };

  const handleToolsMenuClose = () => {
    setToolsMenuAnchor(null);
  };

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const mainNavItems = [
    { path: '/', label: 'Главная', icon: <HomeIcon />, alwaysShow: true },
    { path: '/technologies', label: 'Все технологии', icon: <LibraryIcon />, alwaysShow: false },
    { path: '/add-technology', label: 'Добавить', icon: <AddIcon />, alwaysShow: false },
  ];

  const extraNavItems = [
    { path: '/stats', label: 'Статистика', icon: <StatsIcon /> },
    { path: '/settings', label: 'Настройки', icon: <SettingsIcon /> },
  ];

  const toolsNavItems = [
    { path: '/deadlines', label: 'Установка сроков', icon: <CalendarIcon /> },
    { path: '/edit-statuses', label: 'Изменение статусов', icon: <EditIcon /> },
    { path: '/import-export', label: 'Импорт/экспорт', icon: <ImportIcon /> },
  ];

  const allNavItems = [...mainNavItems, ...extraNavItems, ...toolsNavItems];

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box className="mobile-menu" sx={{ width: 280 }} onClick={handleDrawerToggle}>
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          🚀 Трекер технологий
        </Typography>
        {isLoggedIn && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'white', color: 'primary.main' }}>
              <UserIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">{username}</Typography>
              <Chip 
                label="Онлайн" 
                size="small" 
                sx={{ 
                  height: 22, 
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  mt: 0.5
                }} 
              />
            </Box>
          </Box>
        )}
      </Box>
      
      <List sx={{ p: 2 }}>
        <ListItem sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={onThemeToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {darkMode ? <DarkIcon /> : <LightIcon />}
                <Typography variant="body2">
                  {darkMode ? 'Темная тема' : 'Светлая тема'}
                </Typography>
              </Box>
            }
            sx={{ width: '100%', m: 0 }}
          />
        </ListItem>

        {allNavItems.map((item) => (
          isLoggedIn || item.path === '/' ? (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              {React.cloneElement(item.icon, { 
                sx: { 
                  mr: 2, 
                  fontSize: '1.3rem',
                  color: isActive(item.path) ? 'primary.main' : 'inherit'
                } 
              })}
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: isActive(item.path) ? 'bold' : 'normal'
                }}
              />
            </ListItem>
          ) : null
        ))}
        
        {isLoggedIn ? (
          <>
            <Divider sx={{ my: 2 }} />
            <ListItem 
              button 
              onClick={onLogout}
              sx={{ 
                borderRadius: 2,
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light' }
              }}
            >
              <LogoutIcon sx={{ mr: 2, fontSize: '1.3rem' }} />
              <ListItemText primary="Выйти" primaryTypographyProps={{ fontSize: '1rem' }} />
            </ListItem>
          </>
        ) : (
          <ListItem 
            component={RouterLink} 
            to="/login"
            sx={{ 
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              mt: 2,
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <LoginIcon sx={{ mr: 2, fontSize: '1.3rem' }} />
            <ListItemText primary="Войти" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 'bold' }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        className="main-navigation"
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar sx={{ 
          minHeight: '64px', 
          px: { xs: 1, sm: 2, md: 3 },
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              className="nav-brand"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' },
                fontWeight: 'bold',
                '&:hover': { opacity: 0.9 }
              }}
            >
              🚀 Трекер
            </Typography>

            {!isMobile && isLoggedIn && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                {mainNavItems.map((item) => (
                  (item.alwaysShow || !isTablet) && (
                    <Button
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      size="small"
                      startIcon={React.cloneElement(item.icon, { fontSize: 'small' })}
                      color={isActive(item.path) ? 'primary' : 'inherit'}
                      variant={isActive(item.path) ? 'contained' : 'text'}
                      className="nav-link"
                      sx={{
                        borderRadius: 6,
                        px: 1.5,
                        py: 0.75,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                        minWidth: 'auto',
                        '&.MuiButton-contained': {
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                ))}

                {(isTablet && extraNavItems.length > 0) && (
                  <>
                    <Button
                      onClick={handleMoreMenuOpen}
                      size="small"
                      endIcon={<MoreIcon />}
                      variant="text"
                      className="nav-link"
                      sx={{
                        borderRadius: 6,
                        px: 1.5,
                        py: 0.75,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        color: 'text.secondary'
                      }}
                    >
                      Еще
                    </Button>

                    <Menu
                      anchorEl={moreMenuAnchor}
                      open={Boolean(moreMenuAnchor)}
                      onClose={handleMoreMenuClose}
                    >
                      {extraNavItems.map((item) => (
                        <MenuItem
                          key={item.path}
                          component={RouterLink}
                          to={item.path}
                          onClick={handleMoreMenuClose}
                          selected={isActive(item.path)}
                        >
                          {React.cloneElement(item.icon, { sx: { mr: 2, fontSize: '1rem' } })}
                          {item.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )}

                {!isTablet && extraNavItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    size="small"
                    startIcon={React.cloneElement(item.icon, { fontSize: 'small' })}
                    color={isActive(item.path) ? 'primary' : 'inherit'}
                    variant={isActive(item.path) ? 'contained' : 'text'}
                    className="nav-link"
                    sx={{
                      borderRadius: 6,
                      px: 1.5,
                      py: 0.75,
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                      minWidth: 'auto',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                <Button
                  onClick={handleToolsMenuOpen}
                  size="small"
                  endIcon={<MoreIcon />}
                  variant="outlined"
                  className="nav-link tools-btn"
                  sx={{
                    borderRadius: 6,
                    px: 1.5,
                    py: 0.75,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    ml: 0.5,
                    borderStyle: 'dashed',
                    borderWidth: 1.5
                  }}
                >
                  Инструменты
                </Button>

                <Menu
                  anchorEl={toolsMenuAnchor}
                  open={Boolean(toolsMenuAnchor)}
                  onClose={handleToolsMenuClose}
                >
                  {toolsNavItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      onClick={handleToolsMenuClose}
                      selected={isActive(item.path)}
                    >
                      {React.cloneElement(item.icon, { sx: { mr: 2, fontSize: '1rem' } })}
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5
            }}>
              <LightIcon fontSize="small" sx={{ color: darkMode ? 'text.disabled' : 'primary.main' }} />
              <Switch
                checked={darkMode}
                onChange={onThemeToggle}
                size="small"
                color="primary"
                sx={{ m: 0 }}
              />
              <DarkIcon fontSize="small" sx={{ color: darkMode ? 'primary.main' : 'text.disabled' }} />
            </Box>
            
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleUserMenuOpen}
                  color="inherit"
                  size="small"
                  title="Пользователи"
                  sx={{ 
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Badge badgeContent={users.length} color="primary" size="small">
                    <PeopleIcon fontSize="small" />
                  </Badge>
                </IconButton>
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Пользователи
                    </Typography>
                  </Box>
                  {users.map((user) => (
                    <MenuItem
                      key={user.id}
                      component={RouterLink}
                      to={`/user/${user.id}`}
                      onClick={handleUserMenuClose}
                      dense
                    >
                      <Avatar sx={{ width: 24, height: 24, mr: 1.5, fontSize: '0.8rem' }}>
                        {user.avatar}
                      </Avatar>
                      <Typography variant="body2">{user.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 6,
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                  onClick={handleUserMenuOpen}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.main',
                    }}
                  >
                    <UserIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="body2" fontWeight="bold" className="username" noWrap>
                      {username}
                    </Typography>
                    <Chip 
                      label="Онлайн" 
                      size="small" 
                      sx={{ 
                        height: 16, 
                        fontSize: '0.6rem',
                        bgcolor: 'success.main',
                        color: 'white'
                      }} 
                    />
                  </Box>
                  <IconButton
                    onClick={onLogout}
                    color="inherit"
                    title="Выйти"
                    size="small"
                    className="logout-btn"
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Box>
              </>
            ) : !isMobile && (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                size="small"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 6,
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                Войти
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navigation;