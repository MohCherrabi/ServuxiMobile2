import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterFormScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userType } = useLocalSearchParams();

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  
  // État pour les modals de sélection
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showSubCategory1Picker, setShowSubCategory1Picker] = useState(false);
  const [showSubCategory2Picker, setShowSubCategory2Picker] = useState(false);
  const [showExperiencePicker, setShowExperiencePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profileImage, setProfileImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [businessCardImage, setBusinessCardImage] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);

  // Observer la catégorie principale pour filtrer les sous-catégories
  const watchedMainCategory = watch('mainCategory');

  // Options prédéfinies
  const experienceOptions = [
    { label: '1-4 ans', value: '1-4' },
    { label: '5-9 ans', value: '5-9' },
    { label: '10-14 ans', value: '10-14' },
    { label: '15+ ans', value: '15+' }
  ];

  const categoryOptions = [
    { label: 'Plomberie', value: 'plumbing' },
    { label: 'Électricité', value: 'electricity' },
    { label: 'Peinture', value: 'painting' },
    { label: 'Menuiserie', value: 'carpentry' },
    { label: 'Jardinage', value: 'gardening' },
    { label: 'Nettoyage', value: 'cleaning' },
    { label: 'Informatique', value: 'it' },
    { label: 'Beauté', value: 'beauty' }
  ];

  const subCategoryOptions = {
    plumbing: ['Installation', 'Réparation', 'Maintenance'],
    electricity: ['Installation électrique', 'Réparation appareils', 'Éclairage'],
    painting: ['Peinture intérieure', 'Peinture extérieure', 'Décoration'],
    carpentry: ['Meubles', 'Portes', 'Fenêtres'],
    gardening: ['Tonte', 'Taille', 'Plantation'],
    cleaning: ['Ménage', 'Nettoyage bureau', 'Lavage vitres'],
    it: ['Réparation PC', 'Installation', 'Formation'],
    beauty: ['Coiffure', 'Esthétique', 'Maquillage']
  };

  const cityOptions = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 
    'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'Khouribga', 
    'Beni Mellal', 'El Jadida', 'Nador', 'Settat', 'Larache', 'Ksar El Kebir'
  ];

  // Fonctions utilitaires
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickPortfolioImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setPortfolioImages(result.assets.map(asset => asset.uri));
    }
  };

  const pickBusinessCard = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10], // Format carte de visite
      quality: 0.9,
    });

    if (!result.canceled) {
      setBusinessCardImage(result.assets[0].uri);
    }
  };

  const onDateChange = (event, selectedDate, onChange) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      onChange(formatDate(selectedDate));
    }
  };

  const onSubmit = (data) => {
    console.log('Données validées:', { ...data, userType });
    Alert.alert(t('registrationSuccessTitle'), t('registrationSuccessMessage'));
    router.replace('/(tabs)/home');
  };

  const renderProviderForm = () => (
    <>
      <Text style={styles.formTitle}>{t('createAccount')}</Text>
      <Text style={styles.explanationText}>{t('fieldsWithStarRequired')}</Text>
      
      {/* Champs Obligatoires */}
      <Controller control={control} name="fullName" rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('fullName') + '*'} onBlur={onBlur} onChangeText={onChange} value={value} />)} />
      
      {/* Date de naissance - DatePicker */}
      <Controller control={control} name="birthDate" rules={{ required: true }} render={({ field: { onChange, value } }) => (
        <>
          <TouchableOpacity style={styles.selectInput} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.selectText, !value && styles.placeholderText]}>
              {value || t('birthDate') + '*'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => onDateChange(event, date, onChange)}
              maximumDate={new Date()}
              minimumDate={new Date(1950, 0, 1)}
            />
          )}
        </>
      )} />
      
      {/* Ville - Sélecteur */}
      <Controller 
        control={control} 
        name="city" 
        rules={{ required: true }} 
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowCityPicker(true)}>
              <Text style={[styles.selectText, !value && styles.placeholderText]}>
                {value || t('city') + '*'}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{t('fieldRequired')}</Text>}
          </>
        )} 
      />
      
      {/* Catégorie principale - Sélecteur */}
      <Controller 
        control={control} 
        name="mainCategory" 
        rules={{ required: true }} 
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowCategoryPicker(true)}>
              <Text style={[styles.selectText, !value && styles.placeholderText]}>
                {value ? categoryOptions.find(cat => cat.value === value)?.label : t('mainCategory') + '*'}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{t('fieldRequired')}</Text>}
          </>
        )} 
      />
      
      {/* Sous-catégorie 1 - Sélecteur conditionnel */}
      <Controller control={control} name="subCategory1" rules={{ required: true }} render={({ field: { onChange, value } }) => (
        <TouchableOpacity 
          style={[styles.selectInput, !watchedMainCategory && styles.disabledInput]} 
          onPress={() => watchedMainCategory && setShowSubCategory1Picker(true)}
          disabled={!watchedMainCategory}
        >
          <Text style={[styles.selectText, !value && styles.placeholderText]}>
            {value || (watchedMainCategory ? t('subCategory1') + '*' : t('selectMainCategoryFirst'))}
          </Text>
        </TouchableOpacity>
      )} />
      
      {/* Sous-catégorie 2 - Sélecteur conditionnel */}
      <Controller control={control} name="subCategory2" rules={{ required: true }} render={({ field: { onChange, value } }) => (
        <TouchableOpacity 
          style={[styles.selectInput, !watchedMainCategory && styles.disabledInput]} 
          onPress={() => watchedMainCategory && setShowSubCategory2Picker(true)}
          disabled={!watchedMainCategory}
        >
          <Text style={[styles.selectText, !value && styles.placeholderText]}>
            {value || (watchedMainCategory ? t('subCategory2') + '*' : t('selectMainCategoryFirst'))}
          </Text>
        </TouchableOpacity>
      )} />
      
      <Controller control={control} name="phone" rules={{ required: true, pattern: /^[0-9]{8,15}$/ }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('phone') + '*' + ' (ex: 21234567)'} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="phone-pad" maxLength={15} />)} />
      
      <Controller control={control} name="email" rules={{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('email') + '*'} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />)} />
      
      <Controller control={control} name="bio" rules={{ required: true, minLength: 50 }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, styles.textArea]} placeholder={t('bioDescription') + '*' + ' (min. 50 caractères)'} onBlur={onBlur} onChangeText={onChange} value={value} multiline numberOfLines={4} maxLength={500} />)} />
      
      {/* Années d'expérience - Sélecteur */}
      <Controller 
        control={control} 
        name="experienceYears" 
        rules={{ required: true }} 
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowExperiencePicker(true)}>
              <Text style={[styles.selectText, !value && styles.placeholderText]}>
                {value ? experienceOptions.find(exp => exp.value === value)?.label : t('experienceYears') + '*'}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{t('fieldRequired')}</Text>}
          </>
        )} 
      />
      
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <>
            <Text style={styles.uploadText}>{t('profilePhoto')}*</Text>
            <Text style={styles.uploadSubtext}>{t('tapToUpload')}</Text>
          </>
        )}
      </TouchableOpacity>

      <Controller control={control} name="shop" render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('shopLocation')} onBlur={onBlur} onChangeText={onChange} value={value} />)} />
      
      <Controller control={control} name="cin" render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('cinForVerification')} onBlur={onBlur} onChangeText={onChange} value={value} />)} />
      
      <Controller control={control} name="landlinePhone" render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('landlinePhone') + ' (ex: 71234567)'} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="phone-pad" maxLength={15} />)} />
      
      <TouchableOpacity style={styles.uploadBox} onPress={pickPortfolioImages}>
        {portfolioImages.length > 0 ? (
          <View style={styles.portfolioContainer}>
            <Text style={styles.uploadText}>{t('portfolio')} ({portfolioImages.length}/5)</Text>
            <View style={styles.imageGrid}>
              {portfolioImages.slice(0, 3).map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.portfolioImage} />
              ))}
              {portfolioImages.length > 3 && (
                <View style={styles.moreImagesIndicator}>
                  <Text style={styles.moreImagesText}>+{portfolioImages.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.uploadText}>{t('portfolio')}</Text>
            <Text style={styles.uploadSubtext}>{t('tapToUploadPortfolio')}</Text>
          </>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.uploadBox} onPress={pickBusinessCard}>
        {businessCardImage ? (
          <View style={styles.businessCardContainer}>
            <Text style={styles.uploadText}>{t('businessCard')}</Text>
            <Image source={{ uri: businessCardImage }} style={styles.businessCardImage} />
          </View>
        ) : (
          <>
            <Text style={styles.uploadText}>{t('businessCard')}</Text>
            <Text style={styles.uploadSubtext}>{t('tapToUploadCard')}</Text>
          </>
        )}
      </TouchableOpacity>
      
      <Controller control={control} name="website" render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('website') + ' (ex: www.monsite.com)'} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="url" autoCapitalize="none" autoCorrect={false} />)} />
      
      <Controller control={control} name="workingHours" render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, styles.textArea]} placeholder={t('workingHours')} onBlur={onBlur} onChangeText={onChange} value={value} multiline numberOfLines={3} />)} />
    </>
  );

  const renderClientForm = () => (
    <>
      <Text style={styles.formTitle}>{t('createAccount')}</Text>
      <Controller control={control} name="email" rules={{ required: true, pattern: /^\S+@\S+$/i }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('email')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" />)} />
      <Controller control={control} name="password" rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('password')} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry />)} />
      <Controller control={control} name="confirmPassword" rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={styles.input} placeholder={t('confirmPassword')} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry />)} />
    </>
  );

  return (
    <View style={styles.container}>
      {/* LE HEADER EST MAINTENANT GÉRÉ PAR _layout.js */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userType === 'provider' ? renderProviderForm() : renderClientForm()}
        <TouchableOpacity 
          style={[styles.button, buttonPressed && styles.buttonPressed]} 
          onPress={handleSubmit(onSubmit)}
          onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, buttonPressed && styles.buttonTextPressed]}>
            {userType === 'provider' ? t('createMyAccount') : t('letsGo')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal pour sélecteur de catégorie principale */}
      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectMainCategory')}</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => {
                if (itemValue) {
                  // Reset dependent fields when main category changes
                  setValue('subCategory1', '', { shouldValidate: false });
                  setValue('subCategory2', '', { shouldValidate: false });
                  setValue('mainCategory', itemValue, { shouldValidate: true });
                  setShowCategoryPicker(false);
                }
              }}
            >
              <Picker.Item label={t('selectOption')} value="" />
              {categoryOptions.map((category) => (
                <Picker.Item key={category.value} label={category.label} value={category.value} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal pour sélecteur d'expérience */}
      <Modal visible={showExperiencePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectExperience')}</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => {
                if (itemValue) {
                  setValue('experienceYears', itemValue, { shouldValidate: true });
                  setShowExperiencePicker(false);
                }
              }}
            >
              <Picker.Item label={t('selectOption')} value="" />
              {experienceOptions.map((experience) => (
                <Picker.Item key={experience.value} label={experience.label} value={experience.value} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowExperiencePicker(false)}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modals similaires pour sous-catégories... */}
      <Modal visible={showSubCategory1Picker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectSubCategory1')}</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => {
                if (itemValue) {
                  setValue('subCategory1', itemValue, { shouldValidate: true });
                  setShowSubCategory1Picker(false);
                }
              }}
            >
              <Picker.Item label={t('selectOption')} value="" />
              {watchedMainCategory && subCategoryOptions[watchedMainCategory]?.map((subCat, index) => (
                <Picker.Item key={index} label={subCat} value={subCat} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSubCategory1Picker(false)}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSubCategory2Picker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectSubCategory2')}</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => {
                if (itemValue) {
                  setValue('subCategory2', itemValue, { shouldValidate: true });
                  setShowSubCategory2Picker(false);
                }
              }}
            >
              <Picker.Item label={t('selectOption')} value="" />
              {watchedMainCategory && subCategoryOptions[watchedMainCategory]?.map((subCat, index) => (
                <Picker.Item key={index} label={subCat} value={subCat} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSubCategory2Picker(false)}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal pour sélecteur de ville */}
      <Modal visible={showCityPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectCity')}</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => {
                if (itemValue) {
                  setValue('city', itemValue, { shouldValidate: true });
                  setShowCityPicker(false);
                }
              }}
            >
              <Picker.Item label={t('selectOption')} value="" />
              {cityOptions.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCityPicker(false)}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  formTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#F7F7F7', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 20, fontSize: 16, marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  explanationText: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center', fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, alignSelf: 'flex-start' },
  selectInput: { backgroundColor: '#F7F7F7', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 15, justifyContent: 'center' },
  selectText: { fontSize: 16, color: '#333' },
  placeholderText: { color: '#999' },
  disabledInput: { backgroundColor: '#F0F0F0', borderColor: '#D0D0D0' },
  uploadBox: { height: 120, borderRadius: 12, borderWidth: 2, borderColor: '#E8E8E8', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7', marginBottom: 15 },
  uploadText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  uploadSubtext: { fontSize: 12, color: '#666', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalCloseButton: { backgroundColor: '#FFC700', paddingVertical: 12, borderRadius: 8, marginTop: 15 },
  modalCloseText: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#333' },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: 5, marginLeft: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  portfolioContainer: { alignItems: 'center', width: '100%' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  portfolioImage: { width: 60, height: 60, borderRadius: 8, margin: 2 },
  moreImagesIndicator: { width: 60, height: 60, borderRadius: 8, margin: 2, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  moreImagesText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  businessCardContainer: { alignItems: 'center', width: '100%' },
  businessCardImage: { width: 150, height: 95, borderRadius: 8, marginTop: 10 },
  button: { 
    backgroundColor: '#EAEAEA', 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: '#FFC700',
    transform: [{ scale: 0.98 }],
    shadowColor: '#FFC700',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: { 
    color: '#444', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  buttonTextPressed: {
    color: '#333',
    fontWeight: '800',
  },
});

