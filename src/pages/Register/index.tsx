import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps, colors } from '@utils';
import React, { useState, useCallback, useEffect } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    View
} from 'react-native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@organisms';
import {
    HookFormInput,
    Title,
    Subtitle,
    HyperLink,
    Button,
    Checkbox
} from '@atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { IUserSignUpForm, UserSignUpSchema } from '@schemas';
import { ToggleIcon } from '@molecules';
import { EyeIcon } from '@icons';
import { setSignUpStatus, tryUserSignUp } from '@redux/slices/user';

const Register: React.FC = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const navigation = useNavigation<NavigationProps>();

    const dispatch = useAppDispatch();

    const { registerStatus } = useAppSelector(state => state.user);

    const {
        control,
        handleSubmit,
        formState: {
            errors: { termsAndPrivacy },
        },
    } = useForm<IUserSignUpForm>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: {
            termsAndPrivacy: false,
        },
    });

    const navigateToLogin = useCallback(() => {
        navigation.navigate('Login')
    }, [navigation]);

    const changePasswordVisibility = () => {
        setPasswordVisibility(oldState => !oldState);
    };

    const handleRegister: SubmitHandler<IUserSignUpForm> = (data) => {
        dispatch(tryUserSignUp(data));
    }

    useEffect(() => {
        if (registerStatus === 'success') {
            dispatch(setSignUpStatus('idle'));
            navigateToLogin();
        }
    }, [navigateToLogin, dispatch, registerStatus]);

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>

            <Header canGoBack />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}
                >
                    <View
                        style={styles.container}
                    >
                        <Title>Create your account</Title>

                        <HookFormInput
                            control={control}
                            name="firstName"
                            placeholder="Insert your first name"
                            label="First name"
                            textContentType='name'
                        />

                        <HookFormInput
                            control={control}
                            name="lastName"
                            placeholder="Insert your last name"
                            label="Last name"
                            textContentType='name'
                            style={styles.spacing}
                        />

                        <HookFormInput
                            control={control}
                            name="email"
                            placeholder="Insert a valid email"
                            label="E-mail"
                            textContentType='emailAddress'
                            style={styles.spacing}
                        />

                        <HookFormInput
                            control={control}
                            name="password"
                            placeholder="Minimum 8 characters"
                            label="Password"
                            textContentType="password"
                            secureTextEntry={!passwordVisibility}
                            icon={
                                <ToggleIcon
                                    Icon={EyeIcon}
                                    color={colors.subtitleGrey}
                                    accentColor={colors.primary}
                                    state={passwordVisibility}
                                    onToggle={changePasswordVisibility}
                                />
                            }
                            style={styles.spacing}
                        />

                        <Controller
                            name="termsAndPrivacy"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    style={[styles.terms, styles.spacing]}
                                    textComponent={
                                        <Subtitle style={styles.termsLabel}>
                                            I am over 18 years of age and {' '}
                                            I have read and agree to the {' '}
                                            <HyperLink>
                                                Terms of Service {' '}
                                            </HyperLink>
                                            and {' '}
                                            <HyperLink>
                                                Privacy policy
                                            </HyperLink>.
                                        </Subtitle>
                                    }
                                    isChecked={value}
                                    setChecked={onChange}
                                />
                            )}
                        />
                        {termsAndPrivacy && (
                            <Text style={styles.errorText}>
                                {termsAndPrivacy.message}
                            </Text>
                        )}

                        <Button
                            style={styles.submitButton}
                            label="Create Account"
                            onPress={handleSubmit(handleRegister)}
                        />

                        <Subtitle>
                            Already have an account? {' '}
                            <HyperLink onPress={navigateToLogin}>
                                Log in here
                            </HyperLink>
                        </Subtitle>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Register;