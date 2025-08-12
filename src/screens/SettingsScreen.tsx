import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  List,
  Switch,
  Divider,
  Button,
  Dialog,
  Portal,
  Text,
  RadioButton,
} from 'react-native-paper';

const SettingsScreen: React.FC = () => {
  const [autoDownload, setAutoDownload] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSpeedDialog, setShowSpeedDialog] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the cache? This will delete all downloaded episodes.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: () => {}},
      ],
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Feature coming soon!');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Playback</List.Subheader>
          
          <List.Item
            title="Playback Speed"
            description={`${playbackSpeed}x`}
            left={props => <List.Icon {...props} icon="speedometer" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowSpeedDialog(true)}
          />
          
          <List.Item
            title="Auto Download"
            description="Automatically download new episodes"
            left={props => <List.Icon {...props} icon="download" />}
            right={() => (
              <Switch
                value={autoDownload}
                onValueChange={setAutoDownload}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          
          <List.Item
            title="Push Notifications"
            description="Get notified about new episodes"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Storage</List.Subheader>
          
          <List.Item
            title="Clear Cache"
            description="Delete downloaded episodes and cached data"
            left={props => <List.Icon {...props} icon="delete" />}
            onPress={handleClearCache}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Data Management</List.Subheader>
          
          <List.Item
            title="Export Data"
            description="Export subscriptions and settings"
            left={props => <List.Icon {...props} icon="export" />}
            onPress={handleExportData}
          />
          
          <List.Item
            title="Import Data"
            description="Import subscriptions and settings"
            left={props => <List.Icon {...props} icon="import" />}
            onPress={handleImportData}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="open-in-new" />}
            onPress={() => Alert.alert('Privacy Policy', 'Feature coming soon!')}
          />
          
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="open-in-new" />}
            onPress={() => Alert.alert('Terms of Service', 'Feature coming soon!')}
          />
        </List.Section>
      </ScrollView>

      <Portal>
        <Dialog visible={showSpeedDialog} onDismiss={() => setShowSpeedDialog(false)}>
          <Dialog.Title>Playback Speed</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={setPlaybackSpeed} value={playbackSpeed}>
              {['0.5', '0.75', '1.0', '1.25', '1.5', '2.0'].map(speed => (
                <RadioButton.Item key={speed} label={`${speed}x`} value={speed} />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSpeedDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SettingsScreen;